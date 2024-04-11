import classes from './Loader.module.css';

type Props = { color: string; width?: string | number; className?: string };

export default function Loader({ color, width, className }: Props) {
  return (
    <div
      className={classes.loader + ' ' + className}
      style={{ backgroundColor: color, width: width ? `${width}px` : '25px' }}
    />
  );
}
