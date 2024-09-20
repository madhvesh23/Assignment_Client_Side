import { BASE_URL } from "@/constant";
import { User } from "@/types/booksType";
import { Box, Button, Flex, Grid, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import axios from "axios";
import { useEffect } from "react";
import { bookFormHeaders } from "./bookFormHeaders";
type Props = {
  data?: any;
  isUpdate: boolean;
};

const CreateBookForm = ({ data, isUpdate = false }: Props) => {
  const form = useForm<User>({
    initialValues: {
      author: "",
      genre: "",
      id: "",
      isbn: "",
      publication_date: "",
      title: "",
    },
    validate: {
      author: isNotEmpty("Author is required"),
      isbn: (value) =>
        value.length === 13 ? null : "ISBN must be exactly 13 characters",
      genre: isNotEmpty("Genre is required"),
      publication_date: isNotEmpty("Publication date is required"),
      title: isNotEmpty("Title is required"),
    },
  });
  const modalclose = () => {
    modals.close("create-book-form");
    modals.close("edit-book-form");
  };

  const submitform = async () => {
    try {
      const errors = form.validate();
      if (errors.hasErrors) {
        return;
      }
      const formData = {
        ...form.values,
        publication_date: new Date(form.values.publication_date)
          .toISOString()
          .split("T")[0],
      };
      if (isUpdate) {
        await axios.put(`${BASE_URL}/api/books/${data?.id}`, formData);
        return modalclose();
      } else {
        const response = await axios.post(`${BASE_URL}/api/books`, formData);
        modalclose();
        return response.data;
      }
    } catch (error) {}
  };

  const updateData = () => {
    form.setValues({
      ...data,
      publication_date: new Date(data.publication_date),
    });
  };

  useEffect(() => {
    if (data) updateData();
  }, [data]);

  return (
    <Box component="form">
      <Grid>
        {bookFormHeaders.map((i, index) => {
          if (i.formInputProps === "publication_date")
            return (
              <DatePickerInput
                key={index}
                name="publication_date"
                label={"Publication Date"}
                style={{ width: "100%", paddingLeft: 7, paddingRight: 7 }}
                placeholder="Select Date"
                {...form.getInputProps(i.formInputProps)}
              />
            );
          return (
            <Grid.Col span={i?.column} key={index}>
              <TextInput
                label={i.label}
                placeholder={i.formPlaceHolder}
                {...form.getInputProps(i.formInputProps)}
              />
            </Grid.Col>
          );
        })}
      </Grid>
      <Flex justify={"flex-end"} p={10} flex={1}>
        <Button m={5} onClick={modalclose}>
          Cancel
        </Button>
        <Button m={5} onClick={submitform}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default CreateBookForm;
