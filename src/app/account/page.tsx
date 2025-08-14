import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import SmartRecommendations from "@/components/smart-recommendations"

const applications = [
  { jobTitle: "مهندس كهرباء", company: "شركة الكهرباء الوطنية", date: "2023-10-26", status: "تحت المراجعة" },
  { jobTitle: "مطور واجهات أمامية", company: "تقنية المستقبل", date: "2023-10-24", status: "تم العرض" },
  { jobTitle: "سباك محترف", company: "خدمات الصيانة", date: "2023-10-20", status: "مرفوض" },
]

export default function AccountPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8 font-headline">حسابي</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="applications">طلباتي</TabsTrigger>
          <TabsTrigger value="recommendations">توصيات ذكية</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث معلوماتك الشخصية وسيرتك الذاتية.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input id="fullName" defaultValue="أحمد الصالح" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" defaultValue="ahmad@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">السيرة الذاتية (ملف PDF)</Label>
                <Input id="resume" type="file" />
                <p className="text-sm text-muted-foreground">
                  السيرة الحالية: <a href="#" className="underline text-primary">my_resume.pdf</a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عني</Label>
                <Textarea id="bio" placeholder="تحدث عن مهاراتك وخبراتك..." />
              </div>
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>طلبات التوظيف</CardTitle>
              <CardDescription>تتبع حالة طلبات التوظيف التي قدمتها.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الوظيفة</TableHead>
                      <TableHead>الشركة</TableHead>
                      <TableHead>تاريخ التقديم</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium whitespace-nowrap">{app.jobTitle}</TableCell>
                        <TableCell className="whitespace-nowrap">{app.company}</TableCell>
                        <TableCell className="whitespace-nowrap">{app.date}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'مرفوض' ? 'destructive' : app.status === 'تم العرض' ? 'default': 'secondary'}>{app.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
           <SmartRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  )
}
