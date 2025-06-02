"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import { useForm } from "@mantine/form";
import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true);
    const data = new FormData(e.currentTarget);
    const value = Object.fromEntries(data.entries());
    const finalData = { ...value };

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully registered");
        setLoading(false);
        router.push("/signin");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-block">
            <Logo />
          </div>
        </div>

        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="cth: Rudi Amanah"
              key={form.key("customer_name")}
              {...form.getInputProps("customer_name")}
            />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              key={form.key("customer_email")}
              {...form.getInputProps("customer_email")}
            />
            <TextInput
              withAsterisk
              label="Phone"
              placeholder="cth: +62 813-4756-8723"
              key={form.key("customer_phone")}
              {...form.getInputProps("customer_phone")}
            />
            <DateInput
              withAsterisk
              label="Date of Birth"
              placeholder="cth: 12/03/2000"
              key={form.key("customer_dob")}
              {...form.getInputProps("customer_dob")}
            />
            <TextInput
              withAsterisk
              label="Gender"
              placeholder="cth: Female"
              key={form.key("customer_gender")}
              {...form.getInputProps("customer_gender")}
            />
            <Select
              withAsterisk
              label="Gender"
              placeholder="Select gender"
              data={["Male", "Female"]}
            />
            <TextInput
              withAsterisk
              label="Occupation"
              placeholder="cth: Researcher"
              key={form.key("customer_occupation")}
              {...form.getInputProps("customer_occupation")}
            />
            <Group justify="center" mt="md">
              <Button type="submit" w={"100%"} radius={"xl"} size="lg">
                Submit
              </Button>
            </Group>

            <p className="text-sm text-gray-400 mb-4 text-center">
              By creating an account you agree to our{" "}
              <a href="/#" className="text-primary hover:underline">
                Privacy
              </a>{" "}
              and{" "}
              <a href="/#" className="text-primary hover:underline">
                Policy
              </a>
              .
            </p>

            <p className="text-sm text-gray-400 text-center">
              Already have an account?
              <Link
                href="/signin"
                className="pl-2 text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
