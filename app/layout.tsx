"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/hooks/store";
import TopBar from "@/components/topBar";
import { Affix, Button, ConfigProvider, theme } from "antd";
import { CalculatorOutlined, ContainerOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const router = useRouter();
  return (
    <html lang="en">
      <body className="bg-slate-800">
        <ConfigProvider
          theme={{
            algorithm: darkAlgorithm,
          }}
        >
          <Provider store={store}>
            <TopBar />
            {children}
          </Provider>
          <Affix offsetBottom={30} className="absolute bottom-6">
            <Button
              type="primary"
              shape="circle"
              icon={<ContainerOutlined />}
              className="mx-4 bg-slate-500"
              onClick={() => {
                router.replace("/");
              }}
            ></Button>
            <Button
              type="primary"
              shape="circle"
              icon={<CalculatorOutlined />}
              className=" bg-slate-500"
              onClick={() => {
                router.replace("/calculate");
              }}
            ></Button>
          </Affix>
        </ConfigProvider>
      </body>
    </html>
  );
}
