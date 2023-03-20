import style from './style.module.scss';

const Button = ({label, onClick, small}) => {
  return (
    <button
      type="button"
      className={small ? style.smallButton : style.normalButton}
      onClick={onClick}>
      <strong>{label}</strong>
    </button>
  );
}

export { Button };
