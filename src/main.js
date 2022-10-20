import "./css/index.css"
import IMask from "imask"

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)
securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText =
    securityCode.value.length === 0 ? "123" : securityCode.value
})

const expDate = document.querySelector("#expiration-date")
const expDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear() - 10).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expDateMasked = IMask(expDate, expDatePattern)
expDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = expDate.value.length === 0 ? "02/32" : expDate.value
})

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    { mask: "0000 0000 0000 0000", cardtype: "visa", regex: /^4\d{0,15}/ },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "mastercard",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
    },
    { mask: "0000 0000 0000 0000", cardtype: "default" },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
cardNumberMasked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-number")
  const cardType =
    cardNumberMasked.value === 0
      ? "default"
      : cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  ccNumber.innerText =
    cardNumber.value.length === 0 ? "11234 5678 9012 3456" : cardNumber.value
})

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  const ccBgColor01 = document.querySelector(
    ".cc-bg svg > g g:nth-child(1) path"
  )

  const ccBgColor02 = document.querySelector(
    ".cc-bg svg > g g:nth-child(2) path"
  )

  const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const addbutton = document.querySelector("#add-card")
addbutton.addEventListener("click", () => {
  alert("Cartão adicionado.")
})

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

document.body.addEventListener("load", setCardType("default"))
globalThis.setCardType = setCardType
