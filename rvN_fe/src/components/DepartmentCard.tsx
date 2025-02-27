import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const DepartmentCard = ({
  title,
  content,
  footer,
  imageS,
}: {
  title: string;
  content: string;
  footer: string;
  imageS: string;
}) => {
  return (
    <Card
      className="w-[350px] h-[250px] relative overflow-hidden"
      style={{
        backgroundImage: `url(${imageS})`,
        opacity: "0.9",
        boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2)",
        transition: "box-shadow 1s ease-in-out",
      }}
    >
      {/* https://images.unsplash.com/photo-1530685932526-48ec92998eaa? */}
      <CardHeader>
        <CardTitle
          style={{
            color: "white",
            fontWeight: "bolder",
            margin: "10px",
            paddingTop: "15px",
          }}
        >
          {title}
        </CardTitle>
        {/* <CardDescription> </CardDescription> */}
      </CardHeader>
      <CardContent
        style={{
          color: "white",
          marginLeft: "10px",
          fontWeight: "bold",
        }}
      >
        <p>{content}</p>
      </CardContent>
      <CardFooter
        style={{
          color: "white",
          fontStyle: "italic",
          marginLeft: "10px",
          marginTop: "15px",
          fontWeight: "normal",
        }}
      >
        <p>{footer}</p>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;
