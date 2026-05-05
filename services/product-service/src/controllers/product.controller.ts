import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "@/models/category.model";
/* ---------------------------------- */
/* 🔹 Utility: Build Filters */
/* ---------------------------------- */
const buildProductFilter = (query: any) => {
  const { search, category, minPrice, maxPrice } = query;

  const filter: any = {};

  if (category && category !== "all") {
    filter.category = category;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return filter;
};

/* ---------------------------------- */
/* 🔹 Controller */
/* ---------------------------------- */
const productController = {
  /* ---------------------------------- */
  /* 🔹 Get All Products (Pagination + Filter + Sort) */
  /* ---------------------------------- */
  async getAllProducts(req: Request, res: Response) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Number(req.query.limit) || 20);
      const skip = (page - 1) * limit;

      const sortBy = (req.query.sortBy as string) || "createdAt";
      const order = req.query.order === "asc" ? 1 : -1;

      const filter = buildProductFilter(req.query);

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ [sortBy]: order })
          .skip(skip)
          .limit(limit)
          .lean(),

        Product.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + products.length < total,
        },
      });
    } catch (error) {
      console.error("Get Products Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Single Product */
  /* ---------------------------------- */
  async getProduct(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id).lean();

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching product",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Trending Products */
  /* ---------------------------------- */
  async getTrendingProducts(req: Request, res: Response) {
    try {
      const limit = Math.min(20, Number(req.query.limit) || 6);

      const products = await Product.aggregate([
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ["$rating", 20] },
                { $multiply: ["$discountPercentage", 5] },
                { $multiply: ["$stock", -0.5] },
              ],
            },
          },
        },
        { $sort: { trendingScore: -1 } },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            title: 1,
            price: 1,
            thumbnail: 1,
            rating: 1,
            discountPercentage: 1,
            stock: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Trending Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch trending products",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Hot Deals */
  /* ---------------------------------- */
  async getHotDeals(req: Request, res: Response) {
    try {
      const limit = Math.min(10, Number(req.query.limit) || 5);

      const products = await Product.aggregate([
        {
          $match: {
            discountPercentage: { $gt: 40 },
          },
        },
        { $sort: { discountPercentage: -1 } },
        { $limit: limit },
        {
          $addFields: {
            endTime: {
              $add: ["$$NOW", 1000 * 60 * 60 * 2],
            },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Hot Deals Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch hot deals",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Mega Sale */
  /* ---------------------------------- */
  async getMegaSale(req: Request, res: Response) {
    try {
      const products = await Product.find({
        discountPercentage: { $gt: 50 },
      }).lean();

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching mega sale products",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Categories */
  /* ---------------------------------- */
  async getProductsCategory(req: Request, res: Response) {
    try {
      const categories = await Category.find().lean();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching categories",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Get Products by Category (Paginated) */
  /* ---------------------------------- */
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Number(req.query.limit) || 20);
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find({ category }).skip(skip).limit(limit).lean(),

        Product.countDocuments({ category }),
      ]);

      res.status(200).json({
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching products by category",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Create Product */
  /* ---------------------------------- */
  async createProduct(req: Request, res: Response) {
    try {
      const product = await Product.create(req.body);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating product",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Update Product */
  /* ---------------------------------- */
  async updateProduct(req: Request, res: Response) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).lean();

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating product",
      });
    }
  },

  /* ---------------------------------- */
  /* 🔹 Delete Product */
  /* ---------------------------------- */
  async deleteProduct(req: Request, res: Response) {
    try {
      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting product",
      });
    }
  },
};

export default productController;
