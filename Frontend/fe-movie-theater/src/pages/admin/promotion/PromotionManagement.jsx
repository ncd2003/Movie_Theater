import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../../../components/ui/table";
import { handleApiRequest } from "../../../utils/ApiHandler";
import PromotionApi from "../../../api/PromotionApi";
import FileApi from "../../../api/FileApi";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { formatDateToDDMMYYY } from "../../../utils/DateFormat";
import { toast } from "react-toastify";
import Access from "../../../utils/Access";
const AdminPromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    discountLevel: 0,
    startTime: "",
    endTime: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await PromotionApi.listPromotion();
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const handleOpen = (promo = null) => {
    if (promo) {
      setForm({
        title: promo.title || "",
        detail: promo.detail || "",
        discountLevel: promo.discountLevel || 0,
        startTime: promo.startTime || "",
        endTime: promo.endTime || "",
        image: promo.image || "",
        promotionType: promo.promotionType || "DISCOUNT",
      });
      setEditingId(promo.promotionId);
      setImagePreview(promo.image ? promo.image : null);
      setImageUrl(promo.image ? promo.image : "");
    } else {
      setForm({
        title: "",
        detail: "",
        discountLevel: 0,
        startTime: "",
        endTime: "",
        image: "",
        promotionType: "DISCOUNT",
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);
    setImageFile(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreatePromotion = async () => {
    if (!validateForm(form)) return;

    // Nếu có ảnh, tải ảnh trước khi tạo promotion
    const formDataImage = new FormData();
    formDataImage.append("file", imageFile);
    formDataImage.append("folder", "promotions");

    let newImageUrl;
    await handleApiRequest({
      apiCall: () => FileApi.uploadFile(formDataImage),
      onSuccess: (res) => {
        newImageUrl = res; // Lưu URL ảnh đã tải lên
        console.log(res);
      },
      showSuccessToast: false,
      errorMessage: "Failed to upload image.",
    });

    // Cập nhật form với ảnh đã tải lên
    const updatedForm = { ...form, image: newImageUrl };

    console.log(updatedForm);
    await handleApiRequest({
      apiCall: () => PromotionApi.createANewPromotion(updatedForm),
      onSuccess: () => {
        fetchPromotions();
        handleClose();
        toast.success("Promotion added successfully!");
      },
      onError: () => {
        handleApiRequest({
          apiCall: () => FileApi.deleteFile(imageUrl),
          showSuccessToast: false,
          errorMessage: "Failed to delete old image.",
        });
      },
      errorMessage: "Failed to create promotion.",
    });
  };
  const handleUpdatePromotion = async () => {
    if (!validateForm(form) || !editingId) return;

    let updatedForm = { ...form };

    let newImageUrl;
    // Nếu có ảnh mới, upload trước
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);
      formDataImage.append("folder", "promotions");

      await handleApiRequest({
        apiCall: () => FileApi.uploadFile(formDataImage),
        onSuccess: (res) => {
          newImageUrl = res;
        },
        showSuccessToast: false,
        errorMessage: "Failed to upload image.",
      });

      updatedForm = { ...form, image: newImageUrl };

      handleApiRequest({
        apiCall: () => FileApi.deleteFile(imageUrl),
        showSuccessToast: false,
        errorMessage: "Failed to delete old image.",
      });
    }

    // Cập nhật promotion với dữ liệu mới
    await handleApiRequest({
      apiCall: () => PromotionApi.updatePromotion(editingId, updatedForm),
      onSuccess: () => {
        fetchPromotions();
        handleClose();
      },
      successMessage: "Promotion updated successfully!",
    });
  };

  const handleDelete = async (id, image) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      await handleApiRequest({
        apiCall: async () => await PromotionApi.deletePromotion(id),
        onSuccess: () => fetchPromotions(),
        successMessage: "Promotion deleted successfully!",
      });

      if (image !== null) {
        handleApiRequest({
          apiCall: () => FileApi.deleteFile(image),
          showSuccessToast: false,
          errorMessage: "Failed to delete old image.",
        });
      }
    }
  };

  const filterPromotions = () => {
    return promotions.filter(
      (promo) =>
        promo.title.toLowerCase().includes(search.toLowerCase()) ||
        promo.detail.toLowerCase().includes(search.toLowerCase()) ||
        promo.discountLevel.toString().includes(search)
    );
  };
  const handleOpenDetail = (promo) => {
    setSelectedPromotion(promo);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const validateForm = (formData) => {
    let errors = [];

    if (!formData.title) errors.push("Title is required!");
    if (!formData.detail) errors.push("Detail is required!");
    if (!formData.discountLevel && formData.discountLevel !== 0)
      errors.push("Discount value is required!");
    if (formData.discountLevel < 0 || formData.discountLevel > 100)
      errors.push("Discount cannot be negative!");
    if (!formData.startTime) errors.push("Start time is required!");
    if (!formData.endTime) errors.push("End time is required!");

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
        errors.push("Invalid date format!");
      else if (endTime <= startTime)
        errors.push("End time must be after start time!");
    }
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return false;
    }
    return true;
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Show image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "70px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Search by name..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px", marginRight: "10px" }}
            />
            <Access
              permission={{
                method: "GET",
                apiPath: "/api/v1/promotions",
                module: "Promotion",
              }}
              hideChildren
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => handleOpen()}
              >
                Add New Promotion
              </Button>
            </Access>
          </div>

          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Detail</TableCell>
                  <TableCell>Discount (%)</TableCell>
                  <TableCell>Promotion Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterPromotions().map((promo) => (
                  <TableRow key={promo.promotionId}>
                    <TableCell>{promo.title}</TableCell>
                    <TableCell>{promo.detail}</TableCell>
                    <TableCell>{promo.discountLevel}</TableCell>
                    <TableCell>{promo.promotionType}</TableCell>
                    <TableCell>
                      {formatDateToDDMMYYY(promo.startTime)}
                    </TableCell>
                    <TableCell>{formatDateToDDMMYYY(promo.endTime)}</TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ marginRight: "8px" }}
                        onClick={() => handleOpenDetail(promo)}
                      >
                        Detail
                      </Button>
                      <Access
                        permission={{
                          method: "PUT",
                          apiPath: "/api/v1/promotions/{id}",
                          module: "Promotion",
                        }}
                        hideChildren
                      >
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          sx={{ marginRight: "8px" }}
                          onClick={() => handleOpen(promo)}
                        >
                          Edit
                        </Button>
                      </Access>
                      <Access
                        permission={{
                          method: "DELETE",
                          apiPath: "/api/v1/promotions/{id}",
                          module: "Promotion",
                        }}
                        hideChildren
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() =>
                            handleDelete(promo.promotionId, promo.image)
                          }
                        >
                          Delete
                        </Button>
                      </Access>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {editingId ? "Edit Promotion" : "Add New Promotion"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                name="title"
                fullWidth
                margin="dense"
                value={form.title}
                onChange={handleChange}
              />
              <TextField
                label="Detail"
                name="detail"
                fullWidth
                margin="dense"
                value={form.detail}
                onChange={handleChange}
                multiline
                minRows={4} // Hoặc dùng rows={4} nếu bạn muốn cố định chiều cao
              />
              <FormControl fullWidth margin="dense">
                <FormLabel>Promotion Type</FormLabel>
                <Select
                  name="promotionType"
                  value={form.promotionType}
                  onChange={handleChange}
                >
                  <MenuItem value="DISCOUNT">DISCOUNT</MenuItem>
                  <MenuItem value="GIFT">GIFT</MenuItem>
                  <MenuItem value="SCORE">SCORE</MenuItem>
                </Select>
              </FormControl>

              {form.promotionType !== "GIFT" && (
                <TextField
                  label="Discount (%)"
                  name="discountLevel"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={form.discountLevel}
                  onChange={handleChange}
                />
              )}

              <FormControl fullWidth margin="dense">
                <FormLabel>Start Date</FormLabel>
                <TextField
                  name="startTime"
                  type="datetime-local"
                  fullWidth
                  value={form.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <FormLabel>End Date</FormLabel>
                <TextField
                  name="endTime"
                  type="datetime-local"
                  fullWidth
                  value={form.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <FormLabel>Upload Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <Box mt={2}>
                    <img
                      src={imagePreview}
                      ref={fileInputRef}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() =>
                  editingId ? handleUpdatePromotion() : handleCreatePromotion()
                }
                color="primary"
              >
                {editingId ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
            <DialogTitle>Promotion Details</DialogTitle>
            <DialogContent>
              {selectedPromotion && (
                <Box display="flex" flexDirection="row" alignItems="flex-start" gap={3}>
                  {/* Hình ảnh bên trái */}
                  <Box flexShrink={0}>
                    <img
                      src={selectedPromotion.image || ""}
                      alt="Promotion"
                      style={{
                        width: "250px", // Đặt kích thước cố định cho ảnh
                        height: "250px", // Đảm bảo ảnh không bị bóp méo
                        objectFit: "cover", // Ảnh luôn vừa với khung
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  {/* Thông tin bên phải */}
                  <Box flexGrow={1}>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPromotion.title}
                    </Typography>

                    <Typography variant="body1" mt={1} sx={{ whiteSpace: "pre-line" }}>
                      <strong>Detail:</strong> {selectedPromotion.detail}
                    </Typography>

                    <Typography variant="body1" mt={1}>
                      <strong>Type:</strong> {selectedPromotion.promotionType}
                    </Typography>

                    <Typography variant="body1" mt={1}>
                      <strong>Discount:</strong> {selectedPromotion.discountLevel}%
                    </Typography>

                    <Typography variant="body1" mt={1}>
                      <strong>Start Date:</strong> {formatDateToDDMMYYY(selectedPromotion.startTime)}
                    </Typography>

                    <Typography variant="body1" mt={1}>
                      <strong>End Date:</strong> {formatDateToDDMMYYY(selectedPromotion.endTime)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={alertOpen}
            autoHideDuration={3000}
            onClose={() => setAlertOpen(false)}
          >
            <Alert severity="success">{alertMessage}</Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotionPage;
