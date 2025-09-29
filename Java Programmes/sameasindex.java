import java.util.Scanner;
import java.util.Vector;

public class sameasindex {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            Vector<Long> nums = new Vector<Long>();

            long total = scanner.nextLong();

            long num;

            for (int i=0; i<total; i++) {
                num = scanner.nextLong();
                nums.add(num);
            }
            
            System.out.println("OUTPUT: ");

            for (int j=0; j<nums.size(); j++) {
                if (j == nums.elementAt(j)) {
                    System.out.println(nums.elementAt(j));
                }

                else {
                    System.out.println("NONE");
                }
            }
        }
    }
}
