// File: config/swagger.js

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Nighwan Tech API Documentation',
        version: '1.0.0',
        description: 'Slider, Contact, Career, and Authentication APIs',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5000}`,
            description: 'Local Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        // ==========================================
        // 🚀 SLIDER MODULE (6 Operations)
        // ==========================================

        // 1. GET ALL (Public)
        '/api/slider': {
            get: {
                tags: ['Slider'],
                summary: '1. Get all active sliders (Public)',
                description: 'Returns a list of all sliders where isActive is true.',
                responses: { 200: { description: 'Success' } }
            },
            // 2. CREATE (Admin)
            post: {
                tags: ['Slider'],
                summary: '2. Create a new Slider (Admin Only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    image: { type: 'string', format: 'binary', description: 'Upload Slider Image' },
                                    title: { type: 'string', example: 'Nighwan Tech' },
                                    label: { type: 'string', example: 'Innovation' },
                                    description: { type: 'string', example: 'Engineering your digital growth.' },
                                    componentType: { type: 'string', example: 'home' },
                                    order: { type: 'integer', example: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Created' }, 500: { description: 'Server Error' } }
            }
        },

        // 3. GET ALL (Admin - Inactive bhi dikhenge)
        '/api/slider/admin/all': {
            get: {
                tags: ['Slider'],
                summary: '3. View all sliders (Admin Only)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Success' } }
            }
        },

        // 4. GET BY ID, 5. UPDATE, 6. DELETE (Single)
        '/api/slider/{id}': {
            get: {
                tags: ['Slider'],
                summary: '4. Get single slider by ID',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Success' } }
            },
            put: {
                tags: ['Slider'],
                summary: '5. Update an existing Slider (Admin Only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    image: { type: 'string', format: 'binary', description: 'Upload New Image (Optional)' },
                                    title: { type: 'string' },
                                    label: { type: 'string' },
                                    description: { type: 'string' },
                                    componentType: { type: 'string' },
                                    order: { type: 'integer' },
                                    isActive: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Updated' } }
            },
            delete: {
                tags: ['Slider'],
                summary: '6. Delete a Slider (Admin Only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Deleted' } }
            }
        },

        // 6. BULK DELETE
        '/api/slider/DeleteMultiple': {
            post: {
                tags: ['Slider'],
                summary: '🚀 Extra: Bulk delete multiple sliders',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ids: { type: 'array', items: { type: 'integer' }, example: [1, 2, 5] }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Bulk Deleted successfully' } }
            }
        },

        // ==========================================
        // 📞 CONTACT & INQUIRY LEADS (7 Operations)
        // ==========================================

        // 1. Submit Contact (Public)
        '/api/contact/submit': {
            post: {
                tags: ['Contact'],
                summary: '1. Submit Main Contact Form (Public)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Amit Kumar' },
                                    email: { type: 'string', example: 'amit@test.com' },
                                    phone: { type: 'string', example: '9988776655' },
                                    message: { type: 'string', example: 'I want to know about your services.' },
                                    sourcePage: { type: 'string', example: '/contact' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Contact form submitted' } }
            }
        },

        // 2. Submit Inquiry (Public)
        '/api/contact/inquiry': {
            post: {
                tags: ['Contact'],
                summary: '2. Project Inquiry Modal (Public)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Suresh' },
                                    email: { type: 'string', example: 'suresh@biz.com' },
                                    phone: { type: 'string', example: '+91 9988776655' },
                                    projectType: { type: 'string', example: 'Web Development' },
                                    budget: { type: 'string', example: '$5k-$25k' },
                                    message: { type: 'string', example: 'Need an e-commerce site.' },
                                    sourcePage: { type: 'string', example: '/services' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Inquiry saved successfully' } }
            }
        },

        // 3. GET All Leads (Admin)
        '/api/contact': {
            get: {
                tags: ['Contact'],
                summary: '3. GET All Leads (Contact + Inquiry)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'List of all leads' } }
            }
        },

        // 4. GET Lead By ID, 5. Update, 6. Delete
        '/api/contact/{id}': {
            get: {
                tags: ['Contact'],
                summary: '4. GET Lead Detail by ID',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Lead details' } }
            },
            put: {
                tags: ['Contact'],
                summary: '5. Update Lead Status (e.g. New to Contacted)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'Contacted' },
                                    admin_note: { type: 'string', example: 'Called him, he is interested.' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Updated successfully' } }
            },
            delete: {
                tags: ['Contact'],
                summary: '6. Delete a Single Lead',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Deleted' } }
            }
        },

        // 7. Bulk Delete
        '/api/contact/DeleteMultiple': {
            post: {
                tags: ['Contact'],
                summary: '7. Bulk Delete Multiple Leads',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ids: { type: 'array', items: { type: 'integer' }, example: [10, 11, 15] }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Multiple leads deleted' } }
            }
        },

        // ==========================================
        // 💼 CAREER MODULE (6 Operations)
        // ==========================================

        // 1. Submit Application (Public with Resume Upload)
        '/api/career/apply': {
            post: {
                tags: ['Career'],
                summary: '1. Apply for Job (Public)',
                description: 'Users can submit their application along with a resume (PDF/DOCX).',
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Rahul Developer' },
                                    email: { type: 'string', example: 'rahul.dev@example.com' },
                                    phone: { type: 'string', example: '+91 9876543210' },
                                    appliedFor: { type: 'string', example: 'Backend Node.js Developer' },
                                    department: { type: 'string', example: 'Engineering' },
                                    resume: { type: 'string', format: 'binary', description: 'Upload Resume File (PDF)' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Application Submitted & Email Sent' }, 400: { description: 'Resume missing' } }
            }
        },

        // 2. GET All Applications (Admin)
        '/api/career': {
            get: {
                tags: ['Career'],
                summary: '2. Get All Applications (Admin Only)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Success' } }
            }
        },

        // 3. GET Application By ID, 4. Update, 5. Delete
        '/api/career/{id}': {
            get: {
                tags: ['Career'],
                summary: '3. Get Single Application Detail',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Success' } }
            },
            put: {
                tags: ['Career'],
                summary: '4. Update Application Status (Shortlisted/Rejected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'Shortlisted' },
                                    remarks: { type: 'string', example: 'Good technical skills.' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Updated' } }
            },
            delete: {
                tags: ['Career'],
                summary: '5. Delete a Single Application',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Deleted' } }
            }
        },

        // 6. Bulk Delete
        '/api/career/DeleteMultiple': {
            post: {
                tags: ['Career'],
                summary: '6. Bulk Delete Multiple Applications',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ids: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Bulk Deleted' } }
            }
        },

        // ==========================================
        // 🔐 AUTHENTICATION & USERS MODULE (7 Operations)
        // ==========================================

        // 1. SIGNUP (Public)
        '/api/auth/signup': {
            post: {
                tags: ['Authentication'],
                summary: '1. Register a new Admin/User',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Admin Nighwan' },
                                    email: { type: 'string', example: 'admin@nighwantech.com' },
                                    password: { type: 'string', example: 'Admin@123' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Account Created Successfully' }, 400: { description: 'Validation Error' } }
            }
        },

        // 2. LOGIN (Public)
        '/api/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: '2. Login to get JWT Token',
                description: 'Login with email and password to receive a Bearer token. Use this token in the "Authorize" button above.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'admin@nighwantech.com' },
                                    password: { type: 'string', example: 'Admin@123' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Login successful, returns JWT Token' }, 401: { description: 'Invalid Credentials' } }
            }
        },

        // 3. FORGOT PASSWORD (Public)
        '/api/auth/forgot-password': {
            post: {
                tags: ['Authentication'],
                summary: '3. Forgot Password (Sends Email)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'admin@nighwantech.com' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Reset link sent to email' }, 404: { description: 'Email not found' } }
            }
        },

        // 4. GET ALL USERS (Admin)
        '/api/auth/users': {
            get: {
                tags: ['Authentication'],
                summary: '4. Get All Users (Admin Only)',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'List of all users' } }
            }
        },

        // 5. UPDATE USER, 6. DELETE SINGLE USER
        '/api/auth/user/{id}': {
            put: {
                tags: ['Authentication'],
                summary: '5. Update User details (Admin Only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string', example: 'Updated Name' },
                                    role: { type: 'string', example: 'admin' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'User updated successfully' } }
            },
            delete: {
                tags: ['Authentication'],
                summary: '6. Delete a Single User (Admin Only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'User deleted successfully' } }
            }
        },

        // 7. BULK DELETE USERS
        '/api/auth/users/delete-multiple': {
            post: {
                tags: ['Authentication'],
                summary: '7. Bulk Delete Multiple Users (Admin Only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ids: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Multiple users deleted successfully' } }
            }
        }
    }
};

module.exports = swaggerDocument;