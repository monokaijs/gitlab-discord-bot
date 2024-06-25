import express from "express";

export const apiRoute = express.Router();
apiRoute.get('/', (req, res) => {
  res.json({
    message: 'API_ROUTE'
  })
})
