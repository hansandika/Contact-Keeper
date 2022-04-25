const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route       GET api/contacts
// @desc        Get all users contact
// @access      Private
router.get("/", auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contacts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route       POST api/contacts
// @desc        Add new Contact
// @access      Private
router.post(
	"/",
	auth,
	check("name", "name is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, phone, type } = req.body;

		try {
			const newContact = new Contact({
				user: req.user.id,
				name,
				email,
				phone,
				type,
			});

			const contact = await newContact.save();

			res.json(contact);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route       PUT api/contacts/:id
// @desc        Update Contact
// @access      Private
router.put("/:id", auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	// Build contact object
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			return res.status(404).json({ msg: "Contact Not found" });
		}

		// Make sure user own contact
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not Authorized" });
		}

		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{
				$set: contactFields,
			},
			{ new: true }
		);

		res.json(contact);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route       Delete api/contacts/:id
// @desc        Delete Contact
// @access      Private
router.delete("/:id", auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(404).json({ msg: "Contact Not found" });
		}

		// Make sure user own contact
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		await Contact.findByIdAndRemove(req.params.id);
		res.json({ msg: "Contact removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
