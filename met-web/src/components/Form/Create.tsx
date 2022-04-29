import React from "react";
import { selectError, FormEdit } from "@formio/react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";

const Create = () => {
  const errors = useSelector((state) => selectError("form", state));
  return (
    <Container>
      <h2>Create Form</h2>
      <hr />
      <FormEdit
        form={{ display: "form" }}
        saveText={"Create Form"}
        errors={errors}
      />
    </Container>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     form: { display: "form" },
//     saveText: "Create Form",
//     errors: selectError("form", state),
//   };
// };

export default Create;
