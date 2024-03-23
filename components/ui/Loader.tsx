import classes from './Loader.module.css';

type Props = { color: string; width?: string | number };

export default function Loader({ color, width }: Props) {
  return (
    <div
      className={classes.loader}
      style={{ backgroundColor: color, width: width ? `${width}px` : '25px' }}
    />
  );
}
