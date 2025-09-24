import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    MenuItem,
    Button,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    Box,
    Divider,
} from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import AccountApi from "../../../api/AccountApi";
import { toast } from "react-toastify";

const UserProfile = () => {
    const [user, setUser] = useState({
        id: "",
        fullName: "",
        birthDate: "",
        gender: "",
        email: "",
        identityCard: "",
        phoneNumber: "",
        avatarUrl: "https://source.unsplash.com/random/150x150/?portrait",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AccountApi.getAccount();
                console.log("API response:", response);
                if (response && response.data) {
                    setUser({
                        id: response.data.accountId || "",
                        fullName: response.data.fullName || "A  1Q2",
                        birthDate: response.data.birthDate || "",
                        gender: response.data.gender || "",
                        email: response.data.email || "",
                        identityCard: response.data.identityCard || "",
                        phoneNumber: response.data.phoneNumber || "",
                        avatarUrl: response.data.avatar || "https://source.unsplash.com/random/150x150/?portrait",
                    });

                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await AccountApi.updateAccount(user.id, user);
        console.log("Update response:", response);

        if (response.statusCode === 200) {
            toast.success("Cập nhật thông tin thành công!", { position: "top-right", autoClose: 3000 });
            fetchUserProfile();
        } else {
            toast.error("Cập nhật thất bại, vui lòng thử lại!", { position: "top-right", autoClose: 3000 });
        }
    };


    if (loading) return <Typography>Đang tải thông tin...</Typography>;

    return (
        <>
            <Header />
            <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "80vh", py: 5 }}>
                <Container maxWidth="md">
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={10} md={8}>
                            <Card
                                elevation={4}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <CardContent>
                                    {/* Avatar & Name */}
                                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                        <Avatar
                                            sx={{
                                                bgcolor: deepPurple[500],
                                                width: 110,
                                                height: 110,
                                                mb: 2,
                                                border: "4px solid white",
                                                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                                            }}
                                            src={user.avatarUrl}
                                        >
                                            {user.fullName ? user.fullName.charAt(0) : "U"}
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="bold">
                                            {user.fullName}
                                        </Typography>
                                        <Typography color={grey[600]}>{user.email}</Typography>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Form */}
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    name="fullName"
                                                    value={user.fullName}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    InputProps={{ sx: { borderRadius: 3 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Birth of Date"
                                                    name="birthDate"
                                                    type="date"
                                                    value={user.birthDate}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    InputProps={{ sx: { borderRadius: 3 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Gender"
                                                    name="gender"
                                                    value={user.gender}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    InputProps={{ sx: { borderRadius: 3 } }}
                                                >
                                                    <MenuItem value="MALE">Male</MenuItem>
                                                    <MenuItem value="FEMALE">Female</MenuItem>
                                                    <MenuItem value="OTHER">Other</MenuItem> {/* Sửa lỗi "OTHERr" */}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Identity Card"
                                                    name="identityCard"
                                                    type="number"
                                                    value={user.identityCard}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    InputProps={{ sx: { borderRadius: 3 } }}
                                                    disabled // Không cho chỉnh sửa CMND
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    type="number"
                                                    value={user.phoneNumber}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    InputProps={{ sx: { borderRadius: 3 } }}
                                                />
                                            </Grid>

                                            {/* Button */}
                                            <Grid item xs={12}>
                                                <Box mt={4} textAlign="center">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            px: 4,
                                                            py: 1.5,
                                                            fontSize: "16px",
                                                            borderRadius: 3,
                                                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                                                        }}
                                                    >
                                                        Update user
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default UserProfile;
