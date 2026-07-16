import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const specificationSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    state: { type: String, default: '' },
    craftType: { type: String, default: '' },
    isMSME: { type: Boolean, default: false },
    isSustainable: { type: Boolean, default: false },
    description: { type: String, required: true },
    history: { type: String, default: '' },
    materials: { type: String, default: '' },
    artisan: { type: String, default: '' },
    specifications: [specificationSchema],
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Recalculate rating on save
productSchema.methods.recalcRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

// Virtual: discounted price
productSchema.virtual('salePrice').get(function () {
  return this.price * (1 - this.discount / 100);
});

const Product = mongoose.model('Product', productSchema);
export default Product;
