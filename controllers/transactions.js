const Transactions = require("../models/transactionsModel");

exports.getAllTransactions = async (req,res) => {
  try {
    const result = await Transactions.find();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const {
      transactionDetails,
      paymentMode,
      transactionStatus,
      transactionDate,
    } = req.body;

    const newTransaction = new Transactions({
      transactionDetails,
      paymentMode,
      transactionStatus,
      transactionDate,
    });

    const savedTransaction = await newTransaction.save();

    if (savedTransaction) {
      res.status(201).json({
        message: "Transaction created successfully",
        data: savedTransaction,
      });
    } else {
      res.status(500).json({ error: "Unable to create transaction" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id, transactionStatus } = req.body;

    // Construct the update object with the fields to be updated
    const updateData = { transactionStatus };

    // Perform the update operation
    const updatedTransaction = await Transactions.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (updatedTransaction) {
      res.status(200).json({
        message: "Transaction status has been updated",
        data: updatedTransaction,
      });
    } else {
      res.status(404).json({
        message: "Transaction not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
