import express from 'express'
import isAuthenticated from '../middlewares/isAutnenticated.js';
import { getComapnyById, getCompany, registerCompany, updateCompany } from '../controllers/company.controller.js';

const router = express.Router()

router.route("/register").post(isAuthenticated, registerCompany)
router.route("/get").get(isAuthenticated, getCompany)
router.route("/get/:id").get(isAuthenticated, getComapnyById)
router.route("/update/:id").put(isAuthenticated, updateCompany)

export default router