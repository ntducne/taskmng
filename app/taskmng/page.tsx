"use client";

import { Calendar, DateField, DatePicker, AlertDialog, Button, Checkbox, CheckboxGroup, Chip, Dropdown, FieldError, Form, Header, Input, InputGroup, Label, Modal, Pagination, Spinner, Table, TextField, toast, EmptyState } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "@/schemas/column";
import { ITask } from "@/types/task";
import { createTask, deleteTask, fetchTaskAnalysis, fetchTaskById, fetchTasks, updateTask } from "@/services/services";
import { ArrowUpRightFromSquare, CircleCheckFill, CircleFill, Magnifier, Pencil, TrashBin } from "@gravity-ui/icons";
import { parseDate } from "@internationalized/date";
import { Icon } from "@iconify/react";

const ROWS_PER_PAGE = 10;

const animations = {
  backdrop: [
    "data-[entering]:duration-500",
    "data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
    "data-[exiting]:duration-200",
    "data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
  ].join(" "),
  container: [
    "data-[entering]:animate-in",
    "data-[entering]:fade-in-0",
    "data-[entering]:slide-in-from-bottom-4",
    "data-[entering]:duration-500",
    "data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
    "data-[exiting]:animate-out",
    "data-[exiting]:fade-out-0",
    "data-[exiting]:slide-out-to-bottom-2",
    "data-[exiting]:duration-200",
    "data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
  ].join(" "),
}

export default function Taskmng() {
  const [defaultItem, setDefaultItem] = useState<ITask>({
    task_id: "",
    mgmt_code: 0,
    deploy_date: null,
    bug: 0,
    task_status: 1,
  });
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailItem, setDetailItem] = useState<ITask | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE;
    return tasks.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [page, tasks]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, tasks.length);
  const statusOptions = [
    { value: "1", label: "Coding Local" },
    { value: "2", label: "Local Test" },
    { value: "3", label: "Develop Test" },
    { value: "4", label: "Production Test" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const getData = async () => {
    const data = await fetchTasks({ search: searchValue });
    const remappedData = data.map((item: any, index: number) => ({
      ...item,
      id: index + 1,
    }));
    setTasks(remappedData);
  };

  const getAnalysisData = async () => {
    try {
      const data = await fetchTaskAnalysis();
      setAnalysisData(data);
    } catch (err) {
      console.error("Failed to fetch analysis data: ", err);
    }
  }

  const refreshData = async () => {
    setLoading(true);
    closeDialog();
    await getData();
    await getAnalysisData();
    setLoading(false);
  }

  const getDetail = async (task_id: string) => {
    try {
      setLoading(true);
      const data = await fetchTaskById(task_id);
      setDetailItem(data);
      setDefaultItem({
        task_id: data.task_id,
        mgmt_code: data.mgmt_code,
        deploy_date: data.deploy_date,
        bug: data.bug,
        task_status: data.task_status,
      });
      if (data.task_status) {
        const statusValue = String(data.task_status);
        let selectedStatus: string[] = [];
        for (let i = 1; i <= Number(statusValue); i++) {
          selectedStatus.push(String(i));
        }
        setSelected(selectedStatus);
      }
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to fetch analysis data: ", err);
    } finally {
      setLoading(false);
    }
  };

  const openDialogCreate = () => {
    closeDialog()
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDetailItem(null);
    setSelected([]);
    setDefaultItem({
      task_id: "",
      mgmt_code: 0,
      deploy_date: null,
      bug: 0,
      task_status: 1,
    });
  }

  const changeStatus = (statusValue: any) => {
    let selectedStatus: string[] = [];
    for (let i = 1; i <= Number(statusValue[statusValue.length - 1]); i++) {
      selectedStatus.push(String(i));
    }
    setSelected(selectedStatus);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const payload: any = {
      ...data,
      bug: Number(data.bug),
      mgmt_code: Number(data.mgmt_code),
      task_status: selected.length > 0 ? Number(selected[selected.length - 1]) : 0,
    };
    if (payload.task_status == 4 && (payload.deploy_date == null || payload.deploy_date == "")) {
      toast.danger(`Unable to update the Task status for "Production Test" because the date was not found!!!`);
      return
    }
    try {
      setLoading(true);
      let response = null;
      if (detailItem) {
        response = await updateTask(detailItem.task_id, payload);
      } else {
        response = await createTask(payload);
      }
      if (!response) {
        return;
      }
      closeDialog();
      await refreshData();
    } catch (error) {
      console.error("Lỗi khi lưu task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderStatusChip = useCallback((isCompleted: boolean) => (
    isCompleted ? (
      <Chip color="success">
        <CircleCheckFill width={12} />
        <Chip.Label>Completed</Chip.Label>
      </Chip>
    ) : (
      <Chip>
        <CircleFill width={6} />
        <Chip.Label>Waiting</Chip.Label>
      </Chip>
    )
  ), []);

  const renderCell = useCallback((task: ITask, columnKey: React.Key) => {
    const data = (task as any)[columnKey as string];
    switch (columnKey) {
      case "task_id":
        return (
          <Dropdown>
            <Button className="font-medium cursor-pointer" variant="ghost">{data}</Button>
            <Dropdown.Popover className="min-w-[222px]">
              <Dropdown.Menu>
                <Dropdown.Section>
                  <Header>{data} (#{String(task.mgmt_code)})</Header>
                  <Dropdown.Item id="backlog" textValue="Backlog" href={`https://sha.backlog.jp/view/${data}`} target="_blank">
                    <ArrowUpRightFromSquare className="size-4 shrink-0 text-muted" />
                    Backlog
                  </Dropdown.Item>
                  <Dropdown.Item id="tool" textValue="Project Tool" href={`https://proj-mgmt.miraisoft.com.vn/work_packages/${String(task.mgmt_code)}/activity`} target="_blank">
                    <ArrowUpRightFromSquare className="size-4 shrink-0 text-muted" />
                    Project Tool
                  </Dropdown.Item>
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )
      case "coding":
        return renderStatusChip(task.task_status >= 1)
      case "local_test":
        return renderStatusChip(task.task_status >= 2)
      case "develop_test":
        return renderStatusChip(task.task_status >= 3)
      case "production_test":
        return renderStatusChip(task.task_status === 4)
      case "deploy_date":
        return (data == null || data == "") ? (
          <span className="text-gray-300">Not deployed</span>
        ) : (
          data
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button isIconOnly variant="tertiary" onPress={async () => {
              await getDetail(task.task_id);
            }}>
              <Pencil />
            </Button>
            <AlertDialog>
              <Button isIconOnly variant="danger">
                <TrashBin />
              </Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="danger" />
                      <AlertDialog.Heading>Delete Task permanently?</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <p>
                        This will permanently delete <strong className="text-red-500">{task.task_id}</strong> and all of its
                        data. This action cannot be undone.
                      </p>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" variant="tertiary" >
                        Cancel
                      </Button>
                      <Button slot="close" variant="danger" onClick={async () => {
                        setLoading(true)
                        await deleteTask(task.task_id);
                        await refreshData();
                      }}>
                        Delete Task
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </div>
        );
      default:
        return data;
    }
  }, []);

  return (<>
    {
      loading ? (
        <div className="w-dvw h-dvh bg-black/30 fixed top-0 z-[99999] flex items-center justify-center">
          <Spinner color="accent" />
        </div>
      ) : null
    }
    <h1 className="text-2xl font-bold mb-2 text-gray-600">Task Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div className="shadow-md border border-gray-50 rounded-xl p-3">
        <span className="mb-3 font-medium text-xl text-muted-foreground-1">Coding</span>
        <ul className="list-disc list-inside text-foreground">
          <li className="flex justify-between items-center text-sm">
            Coding
            <span>
              {analysisData ? analysisData.coding : 0}
            </span>
          </li>

        </ul>
      </div>
      <div className="shadow-md border border-gray-50 rounded-xl p-3">
        <span className="mb-3 text-xl text-muted-foreground-1">Waiting Test</span>
        <ul className="list-disc list-inside text-foreground">
          <li className="flex justify-between items-center text-sm">
            Local
            <span>
              {analysisData ? analysisData.waiting_test?.local : 0}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            Dev
            <span>
              {analysisData ? analysisData.waiting_test?.develop : 0}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            Prod
            <span>
              {analysisData ? analysisData.waiting_test?.production : 0}
            </span>
          </li>
        </ul>
      </div>
      <div className="shadow-md border border-gray-50 rounded-xl p-3">
        <span className="mb-3 text-xl text-muted-foreground-1">Test Done</span>
        <ul className="list-disc list-inside text-foreground">
          <li className="flex justify-between items-center text-sm">
            Local
            <span>
              {analysisData ? analysisData.testing?.local : 0}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            Dev
            <span>
              {analysisData ? analysisData.testing?.develop : 0}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            Prod
            <span>
              {analysisData ? analysisData.testing?.production : 0}
            </span>
          </li>
        </ul>
      </div>
      <div className="shadow-md border border-gray-50 rounded-xl p-3">
        <span className="mb-3 text-xl text-muted-foreground-1">Total Task</span>
        <ul className="list-disc list-inside text-foreground">
          <li className="flex justify-between items-center text-sm">
            Total
            <span>
              {analysisData ? analysisData.total : 0}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            Total Bug
            <span>
              {analysisData ? analysisData.bugs : 0}
            </span>
          </li>
        </ul>
      </div>
      <div className="col-span-2 flex justify-end items-end">
        <div className="flex justify-end items-end gap-3">
          <div className="flex gap-2 border-r pr-4 border-gray-200">
            <InputGroup className="border border-gray-500 rounded-md ring-0">
              <InputGroup.Prefix>
                <Magnifier className="size-4 text-muted" />
              </InputGroup.Prefix>
              <InputGroup.Input
                className=""
                placeholder="Search Tasks"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSubmit={(_) => {
                  getData();
                }} />
            </InputGroup>
            <Button size="md" className="px-4 bg-gray-500 text-white rounded-md" onClick={() => {
              getData();
            }}>Search</Button>
          </div>
          <Button size="md" className="px-4 bg-gray-500 text-white rounded-md mb-0.5" onPress={() => openDialogCreate()}>Create Task</Button>
        </div>
      </div>
    </div>
    <Table className="mt-3">
      <Table.ScrollContainer>
        <Table.Content aria-label="Table with pagination" className="min-w-[600px]">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column isRowHeader={column.id === "task_id"}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={paginatedItems} renderEmptyState={() => (
            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
              <Icon className="size-6 text-muted" icon="gravity-ui:tray" />
              <span className="text-sm text-muted">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="current" />
                    <span className="text-xs text-muted">Loading ...</span>
                  </div>
                ) : 'No results found'}
              </span>
            </EmptyState>
          )}>
            {(task) => (
              <Table.Row>
                <Table.Collection items={columns}>
                  {(column) => <Table.Cell>
                    {renderCell(task, column.id)}
                  </Table.Cell>}
                </Table.Collection>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {
        paginatedItems.length ? (
          <Table.Footer>
            <Pagination size="sm">
              <Pagination.Summary>
                {start} to {end} of {tasks.length} results
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <Pagination.PreviousIcon />
                    Prev
                  </Pagination.Previous>
                </Pagination.Item>
                {pages.map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        ) : null
      }


    </Table>
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} className={animations.backdrop} isDismissable={false} isKeyboardDismissDisabled={true}>
      <Modal.Container size='lg' className={animations.container}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading className="font-semibold text-xl">{detailItem ? "Edit Task " + detailItem.task_id : "Create New Task"}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="px-1">
            <Form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextField isRequired name="task_id" type="text" defaultValue={defaultItem.task_id} validate={(value) => {
                    if (!/^LOWCODE-\d{4}$/i.test(value)) {
                      return "Please enter a valid Task ID in format LOWCODE-XXXX";
                    }
                    return null;
                  }}>
                    <Label>Task ID</Label>
                    <Input placeholder="LOWCODE-XXXX" />
                    <FieldError />
                  </TextField>
                  <CheckboxGroup name="task_status" className={`mt-3`} value={selected} onChange={(statusValue) => {
                    changeStatus(statusValue);
                  }}>
                    <Label>Task Status</Label>
                    {
                      statusOptions.map((option) => (
                        <Checkbox key={option.value} value={option.value}>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <Label>{option.label}</Label>
                          </Checkbox.Content>
                        </Checkbox>
                      ))
                    }
                  </CheckboxGroup>
                </div>
                <div>
                  <TextField isRequired name="mgmt_code" type="text" defaultValue={String(defaultItem.mgmt_code)} validate={(value) => {
                    if (!/^\d{1,4}$/.test(value)) {
                      return "Please enter a valid Management Code";
                    }
                    return null;
                  }}>
                    <Label>Management Code</Label>
                    <Input placeholder="1-4 digits" />
                    <FieldError />
                  </TextField>
                  <DatePicker className="w-full mt-3" name="deploy_date" defaultValue={defaultItem?.deploy_date ? parseDate(defaultItem.deploy_date) as any : undefined}>
                    <Label>Date</Label>
                    <DateField.Group fullWidth>
                      <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                      <DateField.Suffix>
                        <DatePicker.Trigger>
                          <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DatePicker.Popover>
                      <Calendar aria-label="Event date">
                        <Calendar.Header>
                          <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
                  <TextField name="bug" type="text" className="mt-3" defaultValue={String(defaultItem.bug)}>
                    <Label>Total Bug</Label>
                    <Input />
                  </TextField>
                </div>
              </div>
              <div className="flex gap-2 mt-3 justify-end">
                <Button type="reset" variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" variant="outline">
                  {detailItem ? "Save Changes" : "Create Task"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </>);
}