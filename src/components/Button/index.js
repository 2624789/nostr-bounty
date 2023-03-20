import style from './style.module.scss';

const Button = ({label, onClick, small, type, disabled}) => {
  return (
    <button
      type={type ? type : "button"}
      className={small ? style.smallButton : style.normalButton}
      onClick={onClick}
      disabled={disabled ? true : false}>
      <strong>{label}</strong>
    </button>
  );
}

export { Button };
