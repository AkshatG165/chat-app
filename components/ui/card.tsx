import classes from './Card.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return <div className={`${classes.card} ${className}`}>{children}</div>;
}
