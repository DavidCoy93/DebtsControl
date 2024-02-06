const router = require("express").Router();

const { GetDebts, CreateDebt, DeleteDebt, UpdateDetailDebt}  = require("../controllers/debtsController");


router.route("/GetDebts").get(GetDebts);
router.route("/CreateDebt").post(CreateDebt);
router.route("/DeleteDebt/:companyName").delete(DeleteDebt);
router.route("/UpdateDetailDebt/:IDebt/:IDetail/:action").put(UpdateDetailDebt);

module.exports = router;