const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer")
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(listingController.index)
.post(
    isLoggedIn, 
    upload.single("listing[image]"),
    (listingController.createListing)
);

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( listingController.showListing)
.put(
   isLoggedIn,
   isOwner,
   upload.single("listing[image]"),
   listingController.updateListing
)
.delete(isLoggedIn,isOwner,listingController.destroyListing);


//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner,listingController.renderEditForm);


module.exports = router;