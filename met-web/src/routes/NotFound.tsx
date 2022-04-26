import React from "react";

const NotFound = React.memo(
  ({ errorMessage = "Page Not Found", errorCode = "404" }: IProps) => {
    return (
      <section>
        <div>
          <p>
            {errorCode}
            <br />
            <small>{errorMessage}</small>
          </p>
          <span />
          <span />
          <span />
        </div>
      </section>
    );
  }
);

export default NotFound;
