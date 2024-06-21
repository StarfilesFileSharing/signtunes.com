import Homepage from "./components/Homepage/homepage";

export default function Home({ searchParams }) {
  return (
    <>
      <Homepage searchParams={searchParams} />
    </>
  );
}
