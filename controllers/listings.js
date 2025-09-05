const Listing = require("../models/listing");
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    const resGeo = await geocoder.geocode(req.body.listing.location);

    let url, filename;
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (url && filename) {
      newListing.image = { url, filename };
    }

    if (resGeo && resGeo.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [resGeo[0].longitude, resGeo[0].latitude]
      };
    } else {
      newListing.geometry = undefined;
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/e_blur:100,h_300,w_250,c_fill"
    );
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    next(err);
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.destroyListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
