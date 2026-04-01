const multer = require("multer")

// Store file in memory (not disk)
const storage = multer.memoryStorage()

// Only allow JPG, PNG, PDF
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
})

module.exports = upload