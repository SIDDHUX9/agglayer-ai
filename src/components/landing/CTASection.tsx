import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router";

export function CTASection() {
  return (
    <section className="py-20 border-t bg-muted/10 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="container px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to start earning?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Deposit MATIC or USDC, track your vault shares in real-time, and view complete transaction history on Polygon.
          </p>
          <Link to="/auth">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 136, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="h-12 px-8 backdrop-blur-sm">
                Launch App
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
