
module.exports = class Debt {
    /**
     * 
     * @param {string} Name 
     * @param {string} Logo 
     * @param {DebtDetail[]} Details 
     */
    constructor(Name, Logo, Details) {
        this.Name = Name;
        this.Logo = Logo;
        this.Details = Details;
    }
}


class DebtDetail {
    /**
     * 
     * @param {string} Description 
     * @param {number} RemainingPayments 
     * @param {number} UnitPrice 
     * @param {boolean} IsPaid
     * @param {number} Total
     */
    constructor(Description, RemainingPayments, UnitPrice, IsPaid, PaymentDate, Total) {
        this.Description = Description;
        this.RemainingPayments = RemainingPayments;
        this.UnitPrice = UnitPrice;
        this.IsPaid = IsPaid;
        this.PaymentDate = PaymentDate;
        this.Total = Total
    }
}