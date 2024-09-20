import { BASE_URL } from "@/constant";
import { User } from "@/types/booksType";
import { ActionIcon, Flex, Text, Title, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import CreateBookForm from "../CreateBook/CreateBookForm";

type Props = {
  data: User;
};
const RenderActions = ({ data }: Props) => {
  const onEditClick = () => {
    try {
      modals.open({
        modalId: "edit-book-form",
        title: (
          <Title size="h4" tt="capitalize" fw={700}>
            Create Service
          </Title>
        ),
        children: <CreateBookForm data={data} isUpdate={true} />,
        centered: true,
        size: "40%",
        shadow: "xl",
        withCloseButton: true,
      });
    } catch (error) {}
  };

  const openDeleteConfirmModal = () =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this Book?",
      children: (
        <Text>
          Are you sure you want to delete?, This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => onDelete(),
    });
  const onDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/books/${data?.id}`);
    } catch (error) {}
  };
  return (
    <Flex gap="md">
      <Tooltip label="Edit">
        <ActionIcon onClick={() => onEditClick()}>
          <IconEdit />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Delete">
        <form action="" onSubmit={onDelete}>
          <ActionIcon color="red" type="submit">
            <IconTrash />
          </ActionIcon>
        </form>
      </Tooltip>
    </Flex>
  );
};

export default RenderActions;
