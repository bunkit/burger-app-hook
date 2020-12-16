export const updateObject = (oldObject, properties) => {
    return {
        ...oldObject,
        ...properties
    }
}
export const makeMessage = (isValid, dataMessage) => {
    let errorMessage = dataMessage.errorMessage
    if (!isValid) {
        errorMessage[dataMessage.type] = dataMessage.message
    } else {
        delete errorMessage[dataMessage.type]
    }
    return errorMessage
}
export const cekVaidity = (value, rules = true) => {
    let isValidationValid = true;
    let errorMessage = {};
    if (rules.required) {
        const isRequiredValid = value.trim() !== '';
        isValidationValid = isRequiredValid && isValidationValid;
        errorMessage = makeMessage(isRequiredValid, {
            errorMessage: errorMessage,
            type: 'required',
            message: 'This field is required'
        })
    }
    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const isEmailValid = pattern.test(value)
        isValidationValid = isEmailValid && isValidationValid
        errorMessage = makeMessage(isValidationValid, {
            errorMessage: errorMessage,
            type: 'email',
            message: 'Please use email format'
        })

    }
    if (rules.minLength) {
        const isMinLengthnValid = value.length >= rules.minLength
        isValidationValid = isMinLengthnValid && isValidationValid
        errorMessage = makeMessage(isMinLengthnValid, {
            errorMessage: errorMessage,
            type: 'minLength',
            message: 'Please enter atleast ' + rules.minLength + ' characters'
        })
    }
    if (rules.maxLength) {
        const isMaxLengthValid = value.length <= rules.maxLength
        isValidationValid = isMaxLengthValid && isValidationValid
        errorMessage = makeMessage(isMaxLengthValid, {
            errorMessage: errorMessage,
            type: 'maxLength',
            message: 'Maximum characther is ' + rules.maxLength
        })
    }

    const dataValidity = {
        value: isValidationValid,
        message: errorMessage[Object.keys(errorMessage)[0]]
    };
    return dataValidity;
}
