import { useState, useEffect } from 'react';

const useForm = (callback, validate) => {
  const initialState = {
    name: "",
    ssl: false,
    domain: "",
    path: ""
  };
const [values, setValues] = useState(initialState);
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

  const clearState = () => {
    setValues({ ...initialState });
  };



  useEffect(() => {
    console.log("useEffect")
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (event) => {
    console.log("handleSubmit")
        if (event) event.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
      };
    
  const handleChange = (event) => {
    console.log("handleChange")
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  return {
    clearState,
    handleChange,
    handleSubmit,
    values,
    errors,
  }
};

export default useForm;