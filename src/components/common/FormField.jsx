function FormField({
  as = 'input',
  id,
  label,
  hint,
  error,
  success,
  filled = false,
  required = false,
  className = '',
  children,
  ...props
}) {
  const Field = as === 'textarea' || as === 'select' ? as : 'input'
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const successId = success ? `${id}-success` : undefined
  const describedBy = [hintId, errorId, successId].filter(Boolean).join(' ') || undefined
  const classes = ['ui-field', filled ? 'ui-field--filled' : '', error ? 'ui-field--error' : '', success ? 'ui-field--success' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="ui-field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <Field
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        className="ui-field__control"
        id={id}
        required={required}
        {...props}
      >
        {as === 'select' ? children : null}
      </Field>
      {hint && (
        <span className="ui-field__hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="ui-field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
      {success && <span className="ui-field__success" id={successId}>{success}</span>}
    </div>
  )
}

export default FormField
