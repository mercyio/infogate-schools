import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, MessageCircle, Send, User, Bell } from "lucide-react";
import { useState } from "react";

const parents = [
  { id: 1, name: "Mr. & Mrs. Johnson", student: "Sarah Johnson", class: "Grade 5A", lastMessage: "Thank you for the update on Sarah's progress." },
  { id: 2, name: "Mr. Chen", student: "Michael Chen", class: "Grade 5A", lastMessage: "Could we schedule a meeting next week?" },
  { id: 3, name: "Mrs. Davis", student: "Emily Davis", class: "Grade 5A", lastMessage: "Emily is struggling with fractions. Any tips?" },
  { id: 4, name: "Mr. & Mrs. Wilson", student: "David Wilson", class: "Grade 5A", lastMessage: "David loved the science project!" },
];

const feedbackTemplates = [
  "Your child is performing excellently in class and shows great enthusiasm for learning.",
  "I've noticed some improvement this week. Let's keep encouraging them!",
  "Your child could benefit from extra practice at home. I recommend focusing on...",
  "Great participation in class today! Keep up the good work.",
];

const ParentCommunication = () => {
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Parent Communication</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/portal/teacher"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-8">Send Feedback to Parents</h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Parent List */}
            <div className="playful-card p-6">
              <h3 className="font-bold mb-4">Select Parent</h3>
              <div className="space-y-3">
                {parents.map((parent) => (
                  <div key={parent.id} className={`p-4 rounded-xl cursor-pointer transition-colors ${selectedParent === parent.id ? 'bg-primary text-card' : 'bg-muted/50 hover:bg-muted'}`} onClick={() => setSelectedParent(parent.id)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedParent === parent.id ? 'bg-card/20' : 'bg-parent/20'}`}>
                        <User className={`w-5 h-5 ${selectedParent === parent.id ? 'text-card' : 'text-parent'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{parent.name}</p>
                        <p className={`text-xs ${selectedParent === parent.id ? 'text-card/80' : 'text-muted-foreground'}`}>{parent.student} • {parent.class}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Composer */}
            <div className="lg:col-span-2 playful-card p-6">
              <h3 className="font-bold mb-4">Compose Message</h3>
              
              {selectedParent ? (
                <>
                  <div className="mb-4 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Sending to:</p>
                    <p className="font-medium">{parents.find(p => p.id === selectedParent)?.name}</p>
                    <p className="text-sm text-muted-foreground">Re: {parents.find(p => p.id === selectedParent)?.student}</p>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Quick Templates</label>
                    <div className="flex flex-wrap gap-2">
                      {feedbackTemplates.map((template, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => setMessage(template)} className="text-xs">
                          Template {i + 1}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea placeholder="Type your message here..." rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>

                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Send Feedback
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a parent to compose a message</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentCommunication;
