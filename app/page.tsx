"use client";
import { booksColumn } from "@/Components/BooksTable/booksColumn";
import BooksTable from "@/Components/BooksTable/BooksTable";
import RenderActions from "@/Components/BooksTable/RenderActions";
import CreateBookForm from "@/Components/CreateBook/CreateBookForm";
import {  Button, Paper, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import React from "react";
 

const Dashboard = () => { 
  const queryClient = new QueryClient();
  const modalOpen = () => {
    try {
      modals.open({
        modalId: "create-book-form",
        title: (
          <Title size="h4" tt="capitalize" fw={700}>
            Create Service
          </Title>
        ),
        children: <CreateBookForm isUpdate={false} />,
        centered: true,
        size: "40%",
        shadow: "xl",
        withCloseButton: true,
      });
    } catch (error) {}
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Paper p={20} style={{ margin: "auto" }}>
        <Title style={{ textAlign: "center", color: "teal" }} p={4} order={1}>
          Book Inventory Table
        </Title>
        <BooksTable
          tableColumns={booksColumn}
          apiUrl="/api/books"
          enableGlobalFilter={false} 
          enableRowActions={true}
          enableRowSelection={true}
          enableRowNumbers={false}
          renderRowActions={({ row: { original } }) => (
            <RenderActions data={original} />
          )}
          columnFilterModeOptions={["contains", "startsWith", "endsWith"]}
          initialState={{
            showColumnFilters: true,
            sorting: [{ id: "created_at", desc: true }],
          }}
          enableExtraFilter={false}
          newCreateCustomComponent={
            <>
              <Button onClick={modalOpen}>Add New Book</Button>
            </>
          }
        />
      </Paper>
    </QueryClientProvider>
  );
};

export default Dashboard;
