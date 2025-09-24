import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromotionApi from "../../../api/PromotionApi";
import { handleApiRequest } from "../../../utils/ApiHandler";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";

import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";

const PromotionDetail = () => {
  const { id } = useParams();
  const [promotion, setPromotion] = useState({});

  useEffect(() => {
    fetchPromotionById(id);
  }, []);

  const fetchPromotionById = async (id) => {
    await handleApiRequest({
      apiCall: () => PromotionApi.getPromotionById(id),
      onSuccess: (res) => {
        setPromotion(res.data);
      },
      showSuccessToast: false,
    });
  };

  return (
    <>
      <Header />

      <Container sx={{ py: 4, minHeight: "70vh" }}>
        <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
          {promotion.title}
        </Typography>

        <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: "100%", md: 400 }, objectFit: "cover" }}
            image={promotion.image}
            alt={promotion.title}
          />
          <CardContent sx={{ flex: 1 }}>
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Program Information:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {promotion.detail}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Promotion Type:
              </Typography>
              <Typography variant="body1">{promotion.promotionType}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Time:
              </Typography>
              <Typography variant="body1">
                {new Date(promotion.startTime).toLocaleDateString("vi-VN")} -{" "}
                {new Date(promotion.endTime).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </>
  );
};

export default PromotionDetail;
