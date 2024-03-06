const fs = require("fs");
const path = require("path");
const Debt = require("../models/debt");
const rootPath = __dirname.substring(0, __dirname.lastIndexOf("helpers"))

exports.ReadDebtsJSON = () => {
    return new Promise((resolve, reject) => {
        fs.stat(path.join(rootPath, "files"), (err, stats) => {
            if (err) {
                reject("Aun no se ha creado ninguna deuda");
            } else {
                fs.stat(path.join(rootPath, "files", "debts.json"), (err, stats) => {
                    if (err) {
                        reject("Aun no se ha creado ninguna deuda");
                    } else {
                        fs.readFile(path.join(rootPath, "files", "debts.json"), { encoding: 'utf-8'}, (err, data) => {
                            try {
                                const debtsList = JSON.parse(data);
                                if (Array.isArray(debtsList)) {
                                    resolve(debtsList);
                                }
                            } catch (error) {
                                reject("Ocurrio un error al obtener las deudas");
                            }

                        })
                    } 
                })
            }
        })
    })
}

exports.CreateDebt = (debt) => {
    return new Promise((resolve, reject) => {
        fs.stat(path.join(rootPath, "files"), (err, stats) => {
            if (err === null) {
                addDebtToList(debt).then((value) => {
                    resolve(value)
                }).catch((reason) => {
                    reject(reason)
                })
            } else {
                fs.mkdir(path.join(rootPath, "files"), (err) => {
                    if (err === null) {
                        fs.writeFile(path.join(rootPath, "files", "debts.json"), "[]", {encoding: 'utf-8' }, (err) => {
                            if (err === null) {
                                addDebtToList(debt).then((value) => {
                                    resolve(value);
                                }).catch((reason) => {
                                    reject(reason);
                                })
                            }
                        })
                    }
                })
            }
        })
    });
}

/**
 * 
 * @param {any} detail Detalle de la deuda
 * @param {number} indexDebt Indice de la deuda
 * @param {string} action Acción a realizar
 * @param {number} IndexDetail Indice del detalle en el listado de detalles de la deuda
 * @returns {Promise<any[]>} 
 */
exports.UpdateAddDebtDetail = (detail, indexDebt, action, IndexDetail) => {
    return new Promise((resolve, reject) => {
        updateAddDebtDetail(detail, indexDebt, action, IndexDetail).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * Metodo para eliminar una deuda del listado almacenado en el archivo debts.json
 * @param {string} companyName 
 * @returns 
 */
exports.DeleteDebt = (companyName) => {
    return new Promise((resolve, reject) => {
        removeDebt(companyName).then((val) => {
            resolve(val);
        }).catch((reason) => {
            reject(reason);
        })
    })
}

const addDebtToList = (debt) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(rootPath, "files", "debts.json"), {encoding: 'utf-8'}, (err, data) => {
            if (err === null) {
                try {
                    const debtsList = JSON.parse(data);
                    if (Array.isArray(debtsList)) {
                        debtsList.push(debt);
                        fs.writeFile(path.join(rootPath, "files", "debts.json"), JSON.stringify(debtsList), {encoding: "utf-8"}, (err) => {
                            if (err === null) {
                                resolve(debtsList);
                            } else {
                                reject(err.message);
                            }
                        })
                    }
                } catch(e) {
                    reject("Ocurrio un error al parsear la información");
                }
            } else {
                reject(err.message);
            }
        })
    })   
}

/**
 * 
 * @param {string} companyName 
 * @returns 
 */
const removeDebt = (companyName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(rootPath, "files", "debts.json"), {encoding: 'utf-8'}, (err, data) => {
            if (err === null) {
                try {
                    const debtList = JSON.parse(data);
                    if (Array.isArray(debtList)) {
                        const debtIndex = debtList.findIndex((val, ind, arr) => {
                            const typedObj = getTypedObject(val);
                            if (typedObj instanceof Debt) {
                                if (typedObj.Name.toLowerCase().includes(companyName.toLowerCase())) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                            
                        })
                        if (debtIndex > -1) {
                            debtList.splice(debtIndex, 1);
                            fs.writeFile(path.join(rootPath, "files", "debts.json"), JSON.stringify(debtList), { encoding: 'utf-8' }, (err) => {
                                if (err === null) {
                                    resolve(debtList);
                                } else {
                                    reject(err.message);
                                }
                            })
                        } else {
                            reject("No se encontro una deuda de la compañia " + companyName);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(err.message);
            }
        })
    })
}

/**
 * 
 * @param {any} obj 
 * @returns 
 */
function getTypedObject(obj) {
    let debt = new Debt('', '', []);
    if (typeof obj === 'object') {
        Object.getOwnPropertyNames(obj).forEach((propName, ind, arr) => {
            debt[propName] = obj[propName];
        })
        return debt;
    } else {
        return undefined;
    }
}

/**
 * Metodo para actualizar el detalle de una deuda
 * @param {any} debtDetail 
 * @param {number} indexDebt 
 * @param {string} action
 * @param {number} IndexDetail
 * @returns {Promise<any[]>}
 */
const updateAddDebtDetail = (debtDetail, indexDebt, action, IndexDetail) => {
    return new Promise(async (resolve, reject) => {

        try
        {
            const debtsJsonFileContentStr = await debtJsonFileContent();

            if (debtsJsonFileContentStr !== '') {
                const debtsList = JSON.parse(debtsJsonFileContentStr);

                if (Array.isArray(debtsList)) {
                    let debt = debtsList[indexDebt];

                    if (Array.isArray(debt.Details)) {
                        if (action === 'update') {
                            debt.Details[IndexDetail] = debtDetail;
                        } else if (action === 'create') {
                            debt.Details.push(debtDetail);
                        }
                        
                        await saveChangesInDebtJson(debtsList);
                        resolve(debt.Details);
                    }
                } else {
                    reject("No se encontrarón deudas");
                }
            } else {
                reject("Ocurrio un error al obtener las deudas");
            }
        } catch (err) {
            reject(err);
        }
    })
}

/**
 * Metodo para obtener el listado de deudas almacenadas en el archivo debts.json
 * @returns {Promise<string>} contenido del archivo debts.json
 */
const debtJsonFileContent = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(rootPath, "files", "debts.json"), {encoding: 'utf-8'}, (err, data) => {
            if (err === null) {
                resolve(data)
            } else {
                resolve("");
            }
        })
    })
}


/**
 * Metodo para actualizar el contenido del archivo debts.json
 * @param {any[]} debtList 
 * @returns {Promise<void>} True si se guardaron los cambios correctamente
 */
const saveChangesInDebtJson = (debtList) => {

    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(rootPath, "files", "debts.json"), JSON.stringify(debtList), {encoding: "utf-8"}, (err) => {
            if (err === null) {
                resolve()
            } else {
                reject("Ocurrio un error al guardar los datos en el archivo debts.json");
            }
        })
    });
}


