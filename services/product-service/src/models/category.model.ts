import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    image: String,
    description: String,
  },
  { timestamps: true },
);

categorySchema.pre("save", async function () {
  const category = this as any;

  if (category.isModified("name")) {
    let slug = slugify(category.name, { lower: true });
    let count = 1;

    const Category = mongoose.model("Category");

    while (await Category.findOne({ slug })) {
      slug = `${slug}-${count++}`;
    }

    category.slug = slug;
  }
});

export default mongoose.model("Category", categorySchema);
