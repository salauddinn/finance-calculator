import Link from "next/link";

type CalculatorCategoryCardProps = {
  description: string;
  href: string;
  title: string;
};

export function CalculatorCategoryCard({
  description,
  href,
  title
}: CalculatorCategoryCardProps) {
  return (
    <article className="category-card">
      <h2 className="category-card__title">{title}</h2>
      <p className="category-card__description">{description}</p>
      <Link className="category-card__link" href={href}>
        {`Explore ${title}`}
      </Link>
    </article>
  );
}
