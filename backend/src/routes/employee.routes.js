import express from "express";
import {
    getAllEmployees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    getManager,
} from "../controllers/employee.controller.js";

const router = express.Router();


router.get("/", getAllEmployees);

router.post("/", addEmployee);


router.put("/:id", editEmployee);


router.delete("/:id", deleteEmployee);


router.get("/manager/:id", getManager);

export default router;
