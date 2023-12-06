import { Button, ButtonProps } from "@mui/material";
import { Link, LinkProps } from "react-router-dom";

type ButtonLinkProps = ButtonProps<"a"> & LinkProps;

export default function ButtonLink(props: ButtonLinkProps) {
  return <Button {...props} component={Link} />;
}
