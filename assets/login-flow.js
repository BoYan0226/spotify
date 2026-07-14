const form = document.querySelector(".login-form")
const phoneInput = document.querySelector("#phone")
const submitButton = document.querySelector(".code-button")
const codeInput = document.querySelector("#verification-code")
const verificationPanel = document.querySelector(".verification-panel")
const codeError = document.querySelector("#code-error")
const maskedPhone = document.querySelector("#masked-phone")
const editButton = document.querySelector(".edit-phone")
const resendButton = document.querySelector(".resend-button")

if (
  form &&
  phoneInput &&
  submitButton &&
  codeInput &&
  verificationPanel &&
  codeError &&
  maskedPhone &&
  editButton &&
  resendButton
) {
  const phoneIsValid = () => /^1\d{10}$/.test(phoneInput.value)
  const codeIsValid = () => /^\d{6}$/.test(codeInput.value)

  const setPhoneError = (showError) => {
    form.classList.toggle("has-error", showError)
    phoneInput.setAttribute("aria-invalid", String(showError))
  }

  const setCodeError = (showError) => {
    form.classList.toggle("has-code-error", showError)
    codeInput.setAttribute("aria-invalid", String(showError))
    codeError.setAttribute("aria-hidden", String(!showError))
  }

  const setCodeSent = (codeSent) => {
    form.classList.toggle("code-sent", codeSent)
    verificationPanel.setAttribute("aria-hidden", String(!codeSent))
    submitButton.textContent = codeSent ? "登入" : "获取验证码"
    submitButton.disabled = codeSent ? !codeIsValid() : !phoneIsValid()

    if (codeSent) {
      maskedPhone.textContent = `${phoneInput.value.slice(0, 3)}****${phoneInput.value.slice(-4)}`
      window.setTimeout(() => codeInput.focus(), 260)
      return
    }

    codeInput.value = ""
    setCodeError(false)
    window.setTimeout(() => phoneInput.focus(), 80)
  }

  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11)
    if (phoneInput.value.length > 0) setPhoneError(false)
    submitButton.textContent = "获取验证码"
    submitButton.disabled = !phoneIsValid()
  })

  codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6)
    if (codeInput.value.length > 0) setCodeError(false)
    submitButton.textContent = "登入"
    submitButton.disabled = !codeIsValid()
  })

  editButton.addEventListener("click", () => setCodeSent(false))

  resendButton.addEventListener("click", () => {
    const label = resendButton.querySelector("span")
    const icon = resendButton.querySelector("img")

    resendButton.disabled = true
    if (label) label.textContent = "已重新发送"
    if (icon) {
      icon.classList.remove("is-spinning")
      requestAnimationFrame(() => icon.classList.add("is-spinning"))
    }

    window.setTimeout(() => {
      resendButton.disabled = false
      if (label) label.textContent = "重新发送"
      if (icon) icon.classList.remove("is-spinning")
    }, 1200)
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (!form.classList.contains("code-sent")) {
      setPhoneError(!phoneIsValid())
      if (phoneIsValid()) setCodeSent(true)
      return
    }

    setCodeError(!codeIsValid())
    if (!codeIsValid()) return

    submitButton.textContent = "登入中…"
    submitButton.disabled = true
    window.setTimeout(() => {
      submitButton.textContent = "登入"
      submitButton.disabled = false
    }, 800)
  })

  submitButton.disabled = true
}
