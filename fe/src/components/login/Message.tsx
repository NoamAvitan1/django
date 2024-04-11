type Props = {
 validationError:any | null
};

export const Message = (props: Props) => {
     console.log(props.validationError?.detail || props.validationError?.message);
  return (
    <div>
      {props.validationError && (
        <p className="mt-4 p-4 text-red-400 text-center">
          {props.validationError?.detail || props.validationError?.message}
        </p>
      )}
    </div>
  );
};
