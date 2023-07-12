"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Spin } from "antd";
import { useAppSelector } from "@/hooks";
import NewItemForm from "./newItemForm";
import { useGearStorage } from "@/hooks/gearStorage";
import { usePathname, useRouter } from "next/navigation";

function Page() {
  let [fileHandle, setFileHandle] = React.useState<FileSystemFileHandle | null>(
    null
  );
  const { gearStorage, setGearStorage } = useGearStorage();
  const pathname = usePathname();
  useEffect(() => {
    if (!gearStorage.length) return;
    appendContent(JSON.stringify(gearStorage));
  }, [gearStorage, fileHandle]);
  const [isSaving, setIsSaving] = React.useState(false);
  const createNewFile = async () => {
    fileHandle = await window.showSaveFilePicker();
    setFileHandle(fileHandle);
  };
  const syncToFile = async () => {
    [fileHandle] = await window.showOpenFilePicker();
    setFileHandle(fileHandle);
    let file = await fileHandle.getFile();
    let fileStorageStr = await file.text();
    let fileStorage = JSON.parse(fileStorageStr);
    setGearStorage(fileStorage);
  };
  const appendContent = async (content: string) => {
    console.log("?");
    if (!fileHandle) return;
    console.log("appendContent");
    console.log(content);
    setIsSaving(true);
    const writable = await fileHandle.createWritable({
      keepExistingData: false,
    });
    await writable.write(content);
    await writable.close();
    setIsSaving(false);
  };
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const onSubmitFormCallback = (result: boolean) => {
    if (result) hideModal();
  };
  return (
    <div className="px-2 py-2 bg-slate-800">
      <div className="flex flex-wrap items-center justify-between bg-slate-800 ">
        <div className="flex justify-between gap-3">
          <Button type="primary" onClick={createNewFile}>
            NewStorage
          </Button>
          <Button type="primary" onClick={syncToFile}>
            OpenStorage
          </Button>
          {fileHandle ? (
            <Button
              type="primary"
              onClick={() => appendContent(JSON.stringify(gearStorage))}
            >
              SaveStorage
            </Button>
          ) : null}
          {isSaving ? <Spin></Spin> : null}
        </div>
        {pathname == "/" ? (
          <Button type="primary" className="mr-2" onClick={showModal}>
            Add New Gear
          </Button>
        ) : null}
      </div>
      <Modal forceRender open={visible} footer={null} onCancel={hideModal}>
        <NewItemForm></NewItemForm>
      </Modal>
    </div>
  );
}

export default Page;
