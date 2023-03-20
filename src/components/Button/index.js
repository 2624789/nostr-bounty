import style from './style.module.scss';

const Button = ({ label, onClick }) => {
  return (
    <button type="button" className={style.button} onClick={onClick}>
      <strong>{label}</strong>
    </button>
  );
}

export { Button };
