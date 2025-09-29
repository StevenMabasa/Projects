import java.util.Scanner;
import java.util.Vector;

public class alternate {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            Vector<Long> nums = new Vector<Long>();
            Long total = scanner.nextLong();
            Long num;

            for (int i=0; i<total; i++) {
                num = scanner.nextLong();
                nums.add(num);
            }

            System.out.print("OUTPUT: [");

            for (int j=0; j<nums.size(); j+=2) {
                System.out.print(nums.elementAt(j));
                System.out.print(" ");
            }

            System.out.println("]");
        }
    }
}
