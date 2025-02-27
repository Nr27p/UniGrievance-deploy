import Accepted from "@/components/Accepted";
//import ExampleNavbarThree from "@/components/Navbar";
import Pending from "@/components/Inprogress";
import Resolved from "@/components/Resolved";
import Rejected from "@/components/Rejected";
import Escalated from "@/components/Escalated";
// import ReportComponent from "@/components/Dashboard/ReportComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
function InvestigatorDash() {
  return (
    <div>
      
      <div className="mx-36">
        <div className="text-3xl mt-10 font-bold">
          {" "}
          All Problems/Incident Reported{" "}
        </div>
        <div className="flex gap-3 flex-col justify-center mt-5">
          <Tabs defaultValue="accepted" className="w-[400px]">
            <div className="flex justify-between">

            <TabsList>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="in-progress">In-Progress</TabsTrigger>
              <TabsTrigger value="escalated">Escalated</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>

            </TabsList>
            </div>
            <TabsContent value="in-progress">
              <Pending/>
            </TabsContent>
            <TabsContent value="accepted">
              <Accepted/>
              </TabsContent>
            <TabsContent value="rejected">
              <Rejected/>
            </TabsContent>
            <TabsContent value="resolved">
              <Resolved/>
            </TabsContent>
            <TabsContent value="escalated">
              <Escalated/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default InvestigatorDash;