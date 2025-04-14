import { User } from "../models/user.models.js";
import { Employee } from "../models/employee.models.js";

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        
        const employees = await Employee.find({});
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "No employees found" });
        }
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new employee
const addEmployee = async (req, res) => {
    try {
        const { name, email, position, role } = req.body;

        // Assuming you're using Employee model, not User
        const employee = new Employee({
            name,
            email,
            position,
            role, // Added role to avoid undefined error
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit an existing employee
const editEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, position } = req.body;

        const employee = await Employee.findByIdAndUpdate(
            id,
            { name, email, position },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get manager of a specific employee
const getManager = async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const manager = await Employee.findById(employee.manager);

        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        res.json(manager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllEmployees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    getManager,
};
