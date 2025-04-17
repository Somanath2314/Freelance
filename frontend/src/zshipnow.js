// ShipNow.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Truck, Package, Scale, AlertCircle } from 'lucide-react';
import './zshipnow.css';
import zshipVideo from './zship.mp4';

const ShipNow = () => {
    const [formData, setFormData] = useState({
        category: '',
        weight: '',
        modeOfTransport: '',
    });
    const [distance, setDistance] = useState('');
    const [codEnabled, setCodEnabled] = useState(false);
    const [quotationCost, setQuotationCost] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errors, setErrors] = useState({});

    const categoryOptions = ["Cloth", "Electronics", "Books", "Furniture", "Vehicle"];
    const transportOptions = ["Road", "Air", "Sea"];

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.weight) newErrors.weight = 'Weight is required';
        if (!formData.modeOfTransport) newErrors.modeOfTransport = 'Transport mode is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGetQuotation = () => {
        if (!formData.weight || !formData.modeOfTransport || !distance) {
            setQuotationCost('Fill weight, mode & distance');
            return;
        }
        const w = parseFloat(formData.weight);
        const d = parseFloat(distance);
        const weightRate = 20;
        const modeRates = { Road:5, Air:15, Sea:2 };
        const raw = w * weightRate + d * (modeRates[formData.modeOfTransport]||0);
        const cost = Math.round(raw);
        const inr = cost.toLocaleString('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        });
        setQuotationCost(inr);
    };

    const handleToggleCOD = () => {
        setCodEnabled(prev => !prev);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        // ← restored original orderData
        const orderData = {
            category: formData.category,
            weight: formData.weight,
            modeOfTransport: formData.modeOfTransport,
            status: 'Pending'
        };

        try {
            await axios.post(
                'http://localhost:8080/api/v1/order/createOrder',
                orderData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": 'application/json' }
                }
            );
            setSubmitStatus('success');
            setFormData({ category: '', weight: '', modeOfTransport: '' });
            setDistance('');
            setCodEnabled(false);
            setQuotationCost(null);
            setTimeout(() => setSubmitStatus(null), 3000);
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    return (
        <div className="shipnow-container">
            <video autoPlay loop muted playsInline className="background-video">
                <source src={zshipVideo} type="video/mp4" />
            </video>

            <motion.div
                className="form-container"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="form-card" variants={itemVariants}>
                    <div className="form-header">
                        <Package className="form-icon" size={32} />
                        <h1>Ship Your Package</h1>
                        <p className="form-subtitle">Enter your shipping details below</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="category">
                                <Package size={18} /> Category
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={errors.category ? "dropdown-field error" : "dropdown-field"}
                                >
                                    <option value="">Select Category</option>
                                    {categoryOptions.map(o => <option key={o}>{o}</option>)}
                                </select>
                                {errors.category && <div className="error-message">{errors.category}</div>}
                            </div>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="weight">
                                <Scale size={18} /> Weight (kg)
                            </label>
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="e.g. 5"
                                value={formData.weight}
                                onChange={handleChange}
                                className={errors.weight ? "input-field error" : "input-field"}
                            />
                            {errors.weight && <div className="error-message">{errors.weight}</div>}
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="modeOfTransport">
                                <Truck size={18} /> Transport Mode
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="modeOfTransport"
                                    name="modeOfTransport"
                                    value={formData.modeOfTransport}
                                    onChange={handleChange}
                                    className={errors.modeOfTransport ? "dropdown-field error" : "dropdown-field"}
                                >
                                    <option value="">Select Mode</option>
                                    {transportOptions.map(o => <option key={o}>{o}</option>)}
                                </select>
                                {errors.modeOfTransport && (
                                    <div className="error-message">{errors.modeOfTransport}</div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label htmlFor="distance">
                                <Scale size={18} /> Approx. Distance (km)
                            </label>
                            <input
                                id="distance"
                                name="distance"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="e.g. 250"
                                value={distance}
                                onChange={e => setDistance(e.target.value)}
                                className="input-field"
                            />
                        </motion.div>

                        <motion.div className="form-actions" variants={itemVariants}>
                            <button
                                type="button"
                                className="quote-button"
                                onClick={handleGetQuotation}
                            >
                                Get Quotation
                            </button>
                            <button
                                type="button"
                                className={`cod-button ${codEnabled ? 'active' : ''}`}
                                onClick={handleToggleCOD}
                            >
                                Cash On Delivery: {codEnabled ? 'Yes' : 'No'}
                            </button>
                        </motion.div>

                        {quotationCost && (
                            <motion.div
                                className="quotation-result"
                                variants={itemVariants}
                            >
                                Estimated Cost: <strong>{quotationCost}</strong>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                            disabled={isSubmitting}
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : 'Create Shipment'}
                        </motion.button>

                        {submitStatus === 'success' && (
                            <motion.div
                                className="status-message success"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Shipment created successfully!
                            </motion.div>
                        )}
                        {submitStatus === 'error' && (
                            <motion.div
                                className="status-message error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle size={16} />
                                Failed to create shipment. Please try again.
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ShipNow;
