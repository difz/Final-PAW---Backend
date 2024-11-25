const {
    createTransaction,
    getTransaction,
    // getTransactionById,
    getTransactionByAccount,
    getTransactionByType,
    getTransactionByCategory,
    // updateTransaction,
    // deleteTransaction

} = require('../models/transaction');
const { use } = require('../routes/transaction');

const getAllTransactions = async (req, res) => {
    try {
        console.log(req.user._id);
        const userId = req.user._id;
        
        const transactions = await getTransaction({ userId });

        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions,
        });
       
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getAllTransactionByAccount = async (req, res) => {
    try {

        const userId = req.user._id;
        const {account} = req.params;

        if(!account){
            return res.status(400).json({
                message: "Account is required to fetch data!",
            });
        }

        const transactions =  await getTransactionByAccount(account);

        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions,
        });
        

    } catch (error) {        
        return res.status(500).json({
            message: error.message,
        });
    }
};

// const getTransactionById = async (id) => {
//     try {
//         return await Transaction.findById(id)
//     } catch (error) {
//         throw new error ('failed to fetch transaction by id: $(error.message)');
//     }
// };


// const getTransactionByType = async (type) => {
//     try {
//         return await Transaction.find({ type });
//     } catch (error) {
//         throw new error ('failed to fetch transaction by type: $(error.message)');
//     }
// };

// const getTransactionByCategory = async (category) => {
//     try {
//         return await Transaction.find({ category });
//     } catch (error) {
//         throw new error ('failed to fetch transaction by category: $(error.message)');
//     }
// };

const createNewTransaction = async (req , res) => {
    try {
        const {
            account,
            type,
            category,
            amount,
            date,
            description
        } = req.body;

        if (!account || !type || !category || !amount ) {
            return res.status(400).json({
                message: "Please fill all the required fields",
            });
        }

        const userId = req.user._id;

        const newTransaction = await createTransaction({
        userId,
        account,
        type,
        category,
        amount,
        date,
        description
        });
        return res.status(201).json({
            message: "Transaction created successfully",
            transaction: newTransaction,
        })
        
    }
    catch (error) { 
        return res.status(500).json({
            message: error.message,
        });
    }
};

// const updateTransaction = async (id, values) => {
//     try {
//         return await Transaction.findOneAndUpdate({ _id: id }, values, { new: true });
//     } catch (error) {
//         throw new error ('failed to update transaction: $(error.message)');
//     }
// };

// const deleteTransaction = async (id) => {
//     try {
//         return await Transaction.findOneAndDelete({_id: id});
//     } catch (error) {
//         throw new error ('failed to delete transaction: $(error.message)');
//     }
// };

module.exports = {
    getAllTransactions,
    // getTransactionById,
    getAllTransactionByAccount,
    // getTransactionByType,
    // getTransactionByCategory,
    createNewTransaction,
    // updateTransaction,
    // deleteTransaction
};

