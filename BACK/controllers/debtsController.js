const fileHelper = require('../helpers/FileHandler');

exports.GetDebts = async (req, res) => {
    try {
        const debts = await fileHelper.ReadDebtsJSON();
        res.status(200).send(debts);
    }
    catch (e) {
        res.status(400).send(e)
    }
}

exports.CreateDebt = async (req, res) => {
    try {
        const debtList = await fileHelper.CreateDebt(req.body);
        res.status(200).send(debtList);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.DeleteDebt = async (req, res) => {
    try {
        const debtList = await fileHelper.DeleteDebt(req.params.companyName);
        res.status(200).send(debtList);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.UpdateDetailDebt = async (req, res) => {
    try {
        const indexDebt = Number(req.params.IDebt);
        const indexDetail = Number(req.params.IDetail);
        const action = req.params.action
        const updated = await fileHelper.UpdateAddDebtDetail(req.body, indexDebt, action, indexDetail);
        res.status(200).send(updated);
    } catch (error) {
        res.status(400).send(error);
    }
}