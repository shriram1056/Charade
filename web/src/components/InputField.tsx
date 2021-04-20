import {
  BackgroundProps,
  CSSObject,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'
//InputHTMLAttributes<HTMLInputElement> this has a lot of optional properties
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
  BackgroundProps & {
    // non-input properties
    label?: string
    placeholder: string
    _placeholder?: CSSObject
    //end
    name: string // we are modifying the InputHTMLAttributes's properties here to be required
    channel?: boolean
    textarea?: boolean
  }
// 'props' is a special keyword in React, which stands for properties and is being used for passing data from one component to another.

export const InputField: React.FC<InputFieldProps> = ({
  //the below 2 are not html properties
  label,
  textarea,
  channel,
  placeholder,
  _placeholder,
  // end
  size: _,
  ...props
}) => {
  let InputOrTextarea = Input
  if (textarea) {
    InputOrTextarea = Textarea as any
  }

  const [field, { error }] = useField(props)
  //this helps to connect the input fields to formik. name is required
  // field: value,name and onChange
  //error is received from setErrors
  return (
    <FormControl isInvalid={!!error}>
      {/*if you render FormErrorMessage and isInvalid is false or undefined, FormErrorMessage won't be visible. The only way to make it visible is by passing isInvalid and setting it to true. */}
      {channel ? null : <FormLabel htmlFor={field.name}>{label}</FormLabel>}
      {/* point label to field with id */}
      <InputOrTextarea
        {...field} // state for value
        {...props} // html input attributes
        id={field.name}
        placeholder={placeholder}
        _placeholder={_placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}
